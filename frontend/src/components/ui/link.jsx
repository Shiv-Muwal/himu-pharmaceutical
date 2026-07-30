import { Link as RouterLink } from "react-router-dom";
import { forwardRef } from "react";

export const Link = forwardRef(function Link({ href, children, ...props }, ref) {
  return (
    <RouterLink ref={ref} to={href} {...props}>
      {children}
    </RouterLink>
  );
});
