import { ChartUpwardIcon } from "@sanity/icons/ChartUpward";
import { Box, Button, Stack, Text } from "@sanity/ui";
import type { Tool } from "sanity";

export type UmamiStatisticsOptions = {
  shareUrl: string;
};

/**
 * Umami Cloud share pages send frame-ancestors * (Chrome embeds them)
 * and also X-Frame-Options: SAMEORIGIN. The iframe is the dashboard.
 * The button opens the same page when a browser honours the older header.
 */
export function UmamiStatistics(props: {
  tool: Tool<UmamiStatisticsOptions>;
}) {
  const shareUrl = props.tool.options?.shareUrl;
  if (!shareUrl) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "70vh",
      }}
    >
      <Box padding={3}>
        <Stack gap={3}>
          <Text size={1}>
            Zbiorcze liczby odwiedzin. Część ruchu znika za blokerami reklam,
            więc tu widać mniej wejść niż było naprawdę.
          </Text>
          <Button
            as="a"
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            mode="ghost"
            tone="primary"
            text="Otwórz statystyki"
            data-testid="umami-open-statistics"
          />
        </Stack>
      </Box>
      <iframe
        src={shareUrl}
        title="Statystyki"
        data-testid="umami-statistics-frame"
        style={{
          border: 0,
          display: "block",
          flex: "1 1 auto",
          width: "100%",
          minHeight: "70vh",
        }}
      />
    </div>
  );
}

export function umamiStatisticsTool(
  shareUrl: string,
): Tool<UmamiStatisticsOptions> {
  return {
    name: "statystyki",
    title: "Statystyki",
    icon: ChartUpwardIcon,
    component: UmamiStatistics,
    options: { shareUrl },
  };
}
