import {
  ITasksResponseType,
  ITasksGroupedByParentsResponse
} from "src/app/interfaces/tasks";

export const transformTasksResponse = (
  response: any,
  response_type: ITasksResponseType
) => {
  switch (response_type) {
    case "parents":
      return Object.values((<ITasksGroupedByParentsResponse>response).tasks);
  }
};
