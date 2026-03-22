import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const LOOP_BLOCKS = 3;
const MIDDLE_LOOP = 1;

export type CycleSelectOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
};

export type CycleSelectProps<T extends string> = {
  options: CycleSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}

/**
 * Get an element's top position within a scroll container's content,
 * using getBoundingClientRect so it works regardless of DOM nesting
 * or CSS positioning context.
 */
function getContentTop(el: HTMLElement, scrollContainer: HTMLElement): number {
  return (
    el.getBoundingClientRect().top -
    scrollContainer.getBoundingClientRect().top +
    scrollContainer.scrollTop
  );
}

function findScrollTargetEl(
  container: HTMLElement,
  value: string,
  direction: -1 | 0 | 1,
  previousEl: HTMLElement | null,
): HTMLElement | null {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(
      `[data-cycle-value="${CSS.escape(String(value))}"]`,
    ),
  );

  if (nodes.length === 0) {
    return null;
  }

  const nearestToVisibleCenter = () => {
    const containerRect = container.getBoundingClientRect();
    const cy = containerRect.top + containerRect.height / 2;
    let best = nodes[0]!;
    let bestD = Infinity;

    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - cy);
      if (d < bestD) {
        bestD = d;
        best = el;
      }
    }

    return best;
  };

  if (!previousEl) {
    if (direction !== 0) {
      return nodes[Math.min(MIDDLE_LOOP, nodes.length - 1)]!;
    }
    return nearestToVisibleCenter();
  }

  const prevTop = getContentTop(previousEl, container);

  if (direction === 1) {
    const below = nodes.filter(
      (el) => getContentTop(el, container) > prevTop + 1,
    );
    return below[0] ?? nodes[0]!;
  }

  if (direction === -1) {
    const above = [...nodes].filter(
      (el) => getContentTop(el, container) < prevTop - 1,
    );
    return above.length ? above[above.length - 1]! : nodes[nodes.length - 1]!;
  }

  return nearestToVisibleCenter();
}

export function CycleSelect<T extends string>({
  options,
  value,
  onChange,
  className,
  disabled = false,
  "aria-label": ariaLabel,
}: CycleSelectProps<T>) {
  const n = options.length;
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const safeIndex = selectedIndex === -1 ? 0 : selectedIndex;
  const resolvedValue = options[safeIndex]?.value ?? value;

  const listRef = React.useRef<HTMLDivElement>(null);
  const blockRef = React.useRef<HTMLDivElement>(null);
  const blockHeightRef = React.useRef(0);
  const suppressScrollJumpRef = React.useRef(false);
  const programmaticScrollRef = React.useRef(false);
  const scrollSettleTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastNavDirectionRef = React.useRef<-1 | 0 | 1>(0);
  const previousSelectedElRef = React.useRef<HTMLElement | null>(null);
  const initializedScrollRef = React.useRef(false);
  const reduceMotion = usePrefersReducedMotion();

  const [viewportHeight, setViewportHeight] = React.useState<number>(0);

  const measureBlockHeight = React.useCallback(() => {
    const h = blockRef.current?.offsetHeight ?? 0;
    blockHeightRef.current = h;
    setViewportHeight(h);
    return h;
  }, []);

  const applyInfiniteScrollJump = React.useCallback(() => {
    const el = listRef.current;
    const bh = blockHeightRef.current;

    if (!el || !bh || n <= 1) {
      return;
    }

    if (suppressScrollJumpRef.current || programmaticScrollRef.current) {
      return;
    }

    if (el.scrollTop < bh - 1) {
      suppressScrollJumpRef.current = true;
      el.scrollTop += bh;
      suppressScrollJumpRef.current = false;
    } else if (el.scrollTop > 2 * bh + 1) {
      suppressScrollJumpRef.current = true;
      el.scrollTop -= bh;
      suppressScrollJumpRef.current = false;
    }
  }, [n]);

  const finishProgrammaticScroll = React.useCallback(() => {
    programmaticScrollRef.current = false;
    applyInfiniteScrollJump();
  }, [applyInfiniteScrollJump]);

  const cycle = React.useCallback(
    (delta: number) => {
      if (disabled || n === 0) {
        return;
      }

      const list = listRef.current;
      const prevVal = options[safeIndex]!.value;
      const prevEl = list
        ? findScrollTargetEl(list, String(prevVal), 0, null)
        : null;

      previousSelectedElRef.current = prevEl;
      lastNavDirectionRef.current = delta > 0 ? 1 : -1;

      const next = (safeIndex + delta + n) % n;
      onChange(options[next]!.value);
    },
    [disabled, n, onChange, options, safeIndex],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      cycle(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cycle(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      lastNavDirectionRef.current = 0;
      previousSelectedElRef.current = null;
      onChange(options[0]!.value);
    } else if (e.key === "End") {
      e.preventDefault();
      lastNavDirectionRef.current = 0;
      previousSelectedElRef.current = null;
      onChange(options[n - 1]!.value);
    }
  };

  const onListScroll = React.useCallback(() => {
    if (!programmaticScrollRef.current) {
      applyInfiniteScrollJump();
    }
  }, [applyInfiniteScrollJump]);

  React.useLayoutEffect(() => {
    measureBlockHeight();
  }, [measureBlockHeight, options, n]);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const bh = measureBlockHeight();

    if (!list || !bh || n <= 1) {
      return;
    }

    if (!initializedScrollRef.current) {
      list.scrollTop = bh;
      initializedScrollRef.current = true;
    }
  }, [measureBlockHeight, n]);

  React.useLayoutEffect(() => {
    const list = listRef.current;

    if (!list || n === 0) {
      return;
    }

    const dir = lastNavDirectionRef.current;
    lastNavDirectionRef.current = 0;

    const target = findScrollTargetEl(
      list,
      String(resolvedValue),
      dir,
      previousSelectedElRef.current,
    );
    previousSelectedElRef.current = null;

    if (target) {
      clearTimeout(scrollSettleTimeoutRef.current);

      const isSmooth = !reduceMotion;
      const behavior = isSmooth ? "smooth" : "auto";

      programmaticScrollRef.current = true;

      const targetContentTop = getContentTop(target, list);
      const targetMid = targetContentTop + target.offsetHeight / 2;
      const visibleMid = list.clientHeight / 2;
      const desiredScrollTop = targetMid - visibleMid;

      list.scrollTo({ top: desiredScrollTop, behavior });

      if (!isSmooth) {
        finishProgrammaticScroll();
      } else {
        const onScrollEnd = () => {
          clearTimeout(scrollSettleTimeoutRef.current);
          list.removeEventListener("scrollend", onScrollEnd);
          finishProgrammaticScroll();
        };

        list.addEventListener("scrollend", onScrollEnd, { once: true });

        scrollSettleTimeoutRef.current = setTimeout(() => {
          list.removeEventListener("scrollend", onScrollEnd);
          finishProgrammaticScroll();
        }, 500);
      }
    }
  }, [resolvedValue, n, reduceMotion, finishProgrammaticScroll]);

  React.useEffect(() => {
    return () => clearTimeout(scrollSettleTimeoutRef.current);
  }, []);

  React.useEffect(() => {
    const list = listRef.current;
    const block = blockRef.current;

    if (!list || !block || n <= 1) {
      return;
    }

    const ro = new ResizeObserver(() => {
      measureBlockHeight();
      if (!programmaticScrollRef.current) {
        applyInfiniteScrollJump();
      }
    });

    ro.observe(block);
    return () => ro.disconnect();
  }, [applyInfiniteScrollJump, measureBlockHeight, n]);

  const handleListWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (disabled || n <= 1) {
      return;
    }

    const el = listRef.current;
    if (!el) {
      return;
    }

    const bh = blockHeightRef.current;
    if (bh <= 0) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const contentFits = scrollHeight <= clientHeight + 2;

    if (contentFits) {
      e.preventDefault();
      if (e.deltaY > 0) {
        cycle(1);
      } else if (e.deltaY < 0) {
        cycle(-1);
      }
      return;
    }

    if (e.deltaY < 0 && atTop) {
      e.preventDefault();
      cycle(-1);
    } else if (e.deltaY > 0 && atBottom) {
      e.preventDefault();
      cycle(1);
    }
  };

  const handleOptionClick = (optionValue: T) => {
    lastNavDirectionRef.current = 0;
    previousSelectedElRef.current = null;
    onChange(optionValue);
  };

  if (n === 0) {
    return null;
  }

  const loops =
    n <= 1 ? [MIDDLE_LOOP] : Array.from({ length: LOOP_BLOCKS }, (_, i) => i);

  const transitionClass = reduceMotion
    ? "duration-0"
    : "duration-[380ms] ease-[cubic-bezier(0.33,1,0.68,1)]";

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-frame border-retro border-foreground bg-background shadow-retro-sm",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Previous option"
        disabled={disabled}
        onClick={() => cycle(-1)}
        className={cn(
          "flex h-12 w-full shrink-0 cursor-pointer items-center justify-center border-b-retro border-foreground transition-colors",
          "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
          "focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-inset outline-none",
        )}
      >
        <ChevronUp className="size-6" aria-hidden />
      </button>

      <div
        ref={listRef}
        onScroll={onListScroll}
        onWheel={handleListWheel}
        style={viewportHeight > 0 ? { height: viewportHeight } : undefined}
        className="min-h-0 w-full overflow-y-auto overscroll-y-contain px-2 py-2 [scrollbar-gutter:stable]"
      >
        <div className="flex flex-col gap-4 px-2">
          {loops.map((loop) => (
            <div
              key={loop}
              ref={loop === 0 ? blockRef : undefined}
              className="flex flex-col gap-3"
            >
              {options.map((option) => {
                const isSelected = option.value === resolvedValue;
                const isA11yBlock = loop === MIDDLE_LOOP;

                return (
                  <button
                    key={`${loop}-${String(option.value)}`}
                    type="button"
                    role="radio"
                    tabIndex={isA11yBlock ? 0 : -1}
                    aria-checked={isSelected && isA11yBlock}
                    data-cycle-value={String(option.value)}
                    disabled={disabled}
                    onClick={() => handleOptionClick(option.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center rounded-poster border-2 px-4 py-4 text-left font-display text-2xl tracking-display outline-none will-change-[transform,box-shadow] sm:py-5 sm:text-3xl",
                      "focus-visible:ring-4 focus-visible:ring-ring/30",
                      "motion-reduce:transition-none",
                      transitionClass,
                      "transition-[background-color,border-color,box-shadow,color,transform]",
                      isSelected
                        ? "border-foreground bg-accent text-accent-foreground shadow-retro-md sm:translate-x-1.5"
                        : "border-transparent text-muted-foreground opacity-[0.72] hover:border-foreground/20 hover:bg-muted/40 hover:opacity-100 hover:text-foreground hover:shadow-retro-xs",
                    )}
                  >
                    <span className="leading-[1.1]">{option.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Next option"
        disabled={disabled}
        onClick={() => cycle(1)}
        className={cn(
          "flex h-12 w-full shrink-0 cursor-pointer items-center justify-center border-t-retro border-foreground transition-colors",
          "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
          "focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-inset outline-none",
        )}
      >
        <ChevronDown className="size-6" aria-hidden />
      </button>
    </div>
  );
}
