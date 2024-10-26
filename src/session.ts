import * as oauth from "npm:@atcute/oauth-browser-client@1";
import * as atcute from "@atcute/client";
import { At } from "@atcute/client/lexicons";

oauth.configureOAuth({
  metadata: {
    client_id: import.meta.env.OAUTH_CLIENT_ID,
    redirect_uri: import.meta.env.OAUTH_REDIRECT_URL,
  },
});

export interface Session {
  session: oauth.Session;
  did: string;
  handle: string | undefined;

  xrpc: atcute.XRPC;
}

const loadOAuthSession = async (): Promise<oauth.Session | undefined> => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  if (params.has("state") && (params.has("code") || params.has("error"))) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    const session = await oauth.finalizeAuthorization(params);
    return session;
  }

  const lastUsedSession = window.localStorage.getItem("rainbow/last-used-session");
  if (lastUsedSession !== null) {
    try {
      return await oauth.getSession(lastUsedSession as At.DID);
    } catch {
      // ignore
    }
  }

  try {
    const did = oauth.listStoredSessions().at(0);
    if (did !== undefined) return await oauth.getSession(did);
  } catch {
    // ignore
  }

  return undefined;
};

export const loadSession = async (
  oauthSession: oauth.Session,
): Promise<Session | undefined> => {
  const did = oauthSession.info.sub;
  const handle = await resolveDIDWithCache(did);

  const agent = new oauth.OAuthUserAgent(oauthSession);
  const xrpc = new atcute.XRPC({ handler: agent });

  return { did, handle, session: oauthSession, xrpc };
};

export let session: Session | undefined;
export function setSession(session_: Session) {
  session = session_;
}

const oauthSession = await loadOAuthSession();
if (oauthSession !== undefined) session = await loadSession(oauthSession);

export function updateStoredSession() {
  if (session) window.localStorage.setItem("rainbow/last-used-session", session.did);
  else window.localStorage.removeItem("rainbow/last-used-session");
}
updateStoredSession();

export async function resolveDID(did: string): Promise<string | undefined> {
  const res = await fetch(
    did.startsWith("did:web:")
      ? `https://${did.split(":")[2]}/.well-known/did.json`
      : "https://plc.directory/" + did,
  );

  return res.json().then(doc => {
    if (!("alsoKnownAs" in doc)) return undefined;
    for (const alias of doc.alsoKnownAs) {
      if (typeof alias !== "string") return;
      if (alias.startsWith("at://")) {
        return alias.substring("at://".length);
      }
    }
  });
}

async function resolveDIDWithCache(did: string): Promise<string | undefined> {
  const cacheKey = "rainbow/did-cache/" + did;

  const cachedHandle = localStorage.getItem(cacheKey);
  if (cachedHandle) return cachedHandle;

  const handle = await resolveDID(did);
  if (handle) localStorage.setItem(cacheKey, handle);

  return handle;
}
