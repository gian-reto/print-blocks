import type { ComponentProps } from "react";
import { Line } from "react-thermal-printer";
import type { LineBlock } from "./schema";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";

type LineProps = ComponentProps<typeof Line>;

export const renderLineBlock = (block: LineBlock) => {
  const props: LineProps = omitUndefined(omit(["type"])(block));

  return <Line {...props} />;
};
