import { Row, Text } from "react-thermal-printer";
import type { RowBlock, RowTextCell } from "./schema";

import type { ComponentProps } from "react";
import { omit } from "../../../util/omit";
import { omitUndefined } from "../../../util/omit-undefined";

type RowProps = ComponentProps<typeof Row>;
type TextProps = ComponentProps<typeof Text>;

const renderRowTextCell = (cell: RowTextCell) => {
  const props: TextProps = omitUndefined(omit(["content"])(cell));

  return <Text {...props}>{cell.content}</Text>;
};

export const renderRowBlock = (block: RowBlock) => {
  const props: RowProps = omitUndefined({
    left: renderRowTextCell(block.left),
    center:
      block.center !== undefined ? renderRowTextCell(block.center) : undefined,
    right: renderRowTextCell(block.right),
    gap: block.gap,
  });

  return <Row {...props} />;
};
