export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/agendarconsulta") {
      return Response.redirect(url.origin + "/agendarconsulta/", 308);
    }
    return env.ASSETS.fetch(request);
  }
};
