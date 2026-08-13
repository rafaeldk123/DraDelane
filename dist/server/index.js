export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/agendarconsulta") {
      return Response.redirect(url.origin + "/agendarconsulta/", 308);
    }
    if (url.pathname === "/agendarconsulta-escura") {
      return Response.redirect(url.origin + "/agendarconsulta-escura/", 308);
    }
    if (url.pathname.startsWith("/agendarconsulta-escura/")) {
      url.pathname = "/agendarconsulta/";
      return env.ASSETS.fetch(new Request(url, request));
    }
    return env.ASSETS.fetch(request);
  }
};
