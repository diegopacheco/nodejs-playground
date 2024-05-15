export default (context) => {
    const { pathname } = new URL(context.request.url);
    if (pathname === "/") {
      return new Response("Hello from Hattip.");
    }
    if (pathname === "/about") {
      return new Response(
        "This HTTP handler works in Node.js, Cloudflare Workers, and Fastly.",
      );
    }
    return new Response("Not found.", { status: 404 });
  };