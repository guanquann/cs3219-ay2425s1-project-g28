import { Box } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

type AppMarginProps = { classname?: string; children: ReactNode };

const AppMargin: FunctionComponent<AppMarginProps> = (
  props: AppMarginProps
) => {
  const { classname, children } = props;
  return (
    <Box
      className={classname}
      sx={(theme) => ({
        marginLeft: theme.spacing(16),
        marginRight: theme.spacing(16),
      })}
    >
      {children}
    </Box>
  );
};

export default AppMargin;
