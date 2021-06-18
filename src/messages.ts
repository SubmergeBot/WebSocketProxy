export type Message = {
  sessionId?: string;
  type?: number;
  from: "master" | "slave";
};
