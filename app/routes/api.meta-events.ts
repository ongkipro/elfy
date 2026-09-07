import type {Route} from './+types/api.meta-events';

export const META_GRAPH_API_VERSION = 'v22.0';

interface CapiEventPayload {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  fbp?: string;
  fbc?: string;
  external_id?: string;
  em?: string;
  ph?: string;
  test_event_code?: string;
  custom_data?: Record<string, unknown>;
}

async function hashValue(value?: string): Promise<string | undefined> {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) return undefined;
  if (/^[a-f0-9]{64}$/i.test(cleaned)) {
    return cleaned.toLowerCase();
  }
  const msgUint8 = new TextEncoder().encode(cleaned);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {status: 405});
  }

  try {
    const payload = (await request.json()) as CapiEventPayload;
    const token = context.env.META_CAPI_ACCESS_TOKEN;
    const pixelId = context.env.PUBLIC_META_PIXEL_ID || '1251216460002426';
    const testEventCode =
      context.env.META_TEST_EVENT_CODE || payload.test_event_code;
    // If no private token is configured, return mock success response for local dev
    if (!token) {
      return new Response(
        JSON.stringify({
          success: true,
          mock: true,
          message: 'CAPI event received in local mock mode (no token set)',
          event_name: payload.event_name,
          event_id: payload.event_id,
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      );
    }

    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '';
    const userAgent = request.headers.get('user-agent') || '';

    const [hashedExternalId, hashedEmail, hashedPhone] = await Promise.all([
      hashValue(payload.external_id),
      hashValue(payload.em),
      hashValue(payload.ph),
    ]);

    const userData: Record<string, unknown> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (payload.fbp) userData.fbp = payload.fbp;
    if (payload.fbc) userData.fbc = payload.fbc;
    if (hashedExternalId) userData.external_id = hashedExternalId;
    if (hashedEmail) userData.em = hashedEmail;
    if (hashedPhone) userData.ph = hashedPhone;

    const capiEvent: Record<string, unknown> = {
      event_name: payload.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: payload.event_id,
      event_source_url: payload.event_source_url || request.headers.get('referer') || request.url,
      action_source: 'website',
      user_data: userData,
      custom_data: payload.custom_data,
    };

    const capiBody: Record<string, unknown> = {
      data: [capiEvent],
    };

    if (testEventCode) {
      capiBody.test_event_code = testEventCode;
    }

    const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(capiBody),
    });

    const result = await response.json();

    return new Response(JSON.stringify({success: response.ok, result}), {
      headers: {'Content-Type': 'application/json'},
      status: response.status,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Meta CAPI Proxy Error:', errorMessage);
    return new Response(JSON.stringify({error: 'Failed to process CAPI event'}), {
      headers: {'Content-Type': 'application/json'},
      status: 500,
    });
  }
}
