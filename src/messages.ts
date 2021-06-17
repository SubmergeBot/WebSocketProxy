export type Message = {
  id?: string;
  type?: number;
  from: "master" | "slave";
};
