// Apple universal links: lets https://daygo.ai/join/<code> open the Daygo
// app directly when it's installed (clinic invite QR codes).
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    applinks: {
      details: [{ appIDs: ["ZT8K5NB7H9.ai.daygo.app"], components: [{ "/": "/join/*", comment: "Clinic invites" }] }],
    },
  });
}
