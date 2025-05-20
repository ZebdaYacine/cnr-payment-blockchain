import { ErrorResponse } from "../../../../services/model/commun";
import {
  PKI1Response,
  HackingTryPKIResponse,
  WorkersErrorRatePKIResponse,
} from "../../data/dtos/DashBoardDtos";

export interface DashBoardRepository {
  GetUplaodFilesPKI(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse>;

  GetHackingTryPKI(
    token: string,
    permission: string
  ): Promise<HackingTryPKIResponse | ErrorResponse>;

  GetWorkersErrorRatePKI(
    token: string,
    permission: string
  ): Promise<WorkersErrorRatePKIResponse | ErrorResponse>;
}
