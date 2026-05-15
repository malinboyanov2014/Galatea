import { InteractiveBrowserCredential } from "@azure/identity";

async function getInteractiveToken() {
  const credential = new InteractiveBrowserCredential({
    client_id: "0f795f50-4f80-4568-a9a7-90a66cda84b5",
  });
  const scope = "api://f268abc5-104c-457c-94a3-f465eebad9d0/access_as_user";
  const token = await credential.getToken(scope);
  return token;
}

const token = await getInteractiveToken();
console.log(token.token);
