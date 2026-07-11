import type { ComponentProps } from "react";
import { Text } from "react-thermal-printer";
import type { TextBlock } from "./schema";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";

type TextProps = ComponentProps<typeof Text>;

export const renderTextBlock = (block: TextBlock) => {
  const props: TextProps = omitUndefined(omit(["content", "type"])(block));

  return <Text {...props}>{block.content}</Text>;
};
