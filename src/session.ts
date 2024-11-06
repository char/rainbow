import * as atcute from "@atcute/client";
import { mergeHeaders } from "@atcute/client/utils/http";
import * as oauth from "npm:@atcute/oauth-browser-client@1";
import { BSKY_MODERATION, labelerServiceIDs } from "./state/labelers.ts";
import { Subscribable } from "./util/subscribable.ts";

oauth.configureOAuth({
  metadata: {
    client_id: import.meta.env.OAUTH_CLIENT_ID,
    redirect_uri: import.meta.env.OAUTH_REDIRECT_URL,
  },
});

export interface Session {
  session: oauth.Session;
  did: string;

  xrpc: atcute.XRPC;
}

const loadSession = (oauthSession: oauth.Session): Session => {
  const did = oauthSession.info.sub;

  const agent = new oauth.OAuthUserAgent(oauthSession);
  const handler = async (path: string, init: RequestInit) => {
    init.headers = mergeHeaders(init.headers, {
      "atproto-accept-labelers": labelerServiceIDs
        .get()
        .map(it => (it === BSKY_MODERATION ? `${it};redact` : it)) // TODO: make this configurable
        .join(", "),
    });

    return await agent.handle(path, init);
  };

  const xrpc = new atcute.XRPC({ handler });

  return { did, session: oauthSession, xrpc };
};

export const sessions: Session[] = [];
export const currentSession = new Subscribable<Session | undefined>(undefined);
export let session: Session | undefined; // sugared access
currentSession.subscribe(it => (session = it));

let primarySessionId =
  localStorage.getItem("rainbow/last-used-session") ?? oauth.listStoredSessions().at(0);

const params = new URLSearchParams(location.hash.substring(1));
if (params.has("state") && (params.has("code") || params.has("error"))) {
  history.replaceState(null, "", location.pathname + location.search);
  const oauthSession = await oauth.finalizeAuthorization(params);
  primarySessionId = oauthSession.info.sub;
}

for (const sessionId of oauth.listStoredSessions()) {
  const oauthSession = await oauth.getSession(sessionId);
  const sessionObj = loadSession(oauthSession);
  sessions.push(sessionObj);
  if (sessionId === primarySessionId) session = sessionObj;
}

export function updateStoredSession() {
  if (session) localStorage.setItem("rainbow/last-used-session", session.did);
  else localStorage.removeItem("rainbow/last-used-session");
}
currentSession.subscribeImmediate(it => {
  if (it !== undefined) updateStoredSession();
});
