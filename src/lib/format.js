import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.locale("zh-cn");

export const formatLastSync = (date) => {
  if (!date) return "从未同步";
  return dayjs(date).calendar(null, {
    sameDay: "[今天] HH:mm",
    nextDay: "[明天] HH:mm",
    nextWeek: "MM-DD HH:mm",
    lastDay: "[昨天] HH:mm",
    lastWeek: "YYYY-MM-DD HH:mm",
  });
};

export const formatPublishDate = (date) => {
  return dayjs(date).fromNow();
};

export const generateReadableDate = (dateString) =>
  dayjs(dateString).format("dddd, MMMM D, YYYY h:mm A");
