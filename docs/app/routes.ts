import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/docs/layout.tsx", [
    route("docs/call-sheet", "routes/docs/call-sheet.tsx"),
    route("docs/blocking", "routes/docs/blocking.tsx"),
    route("docs/props", "routes/docs/props.tsx"),
    route("docs/wardrobe", "routes/docs/wardrobe.tsx"),
    route("docs/wrap", "routes/docs/wrap.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
