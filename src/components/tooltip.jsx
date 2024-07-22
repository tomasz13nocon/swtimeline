import * as Popover from "@radix-ui/react-popover";
import c from "./styles/tooltip.module.scss";
import clsx from "clsx";
import Icon from "./icon";

const questionMarkPath =
  "M10 19h3v3h-3zm2-17c5.35.22 7.68 5.62 4.5 9.67c-.83 1-2.17 1.66-2.83 2.5C13 15 13 16 13 17h-3c0-1.67 0-3.08.67-4.08c.66-1 2-1.59 2.83-2.25C15.92 8.43 15.32 5.26 12 5a3 3 0 0 0-3 3H6a6 6 0 0 1 6-6";

export default function Tooltip({ children, className, info }) {
  return (
    <Popover.Root>
      <Popover.Trigger className={clsx(c.trigger, className)} aria-label="hint">
        <Icon path={questionMarkPath} className={c.triggerIcon} size={0.5} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={clsx(c.content, info && c.info)} sideOffset={5}>
          <Popover.Arrow className={c.arrow} />
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}