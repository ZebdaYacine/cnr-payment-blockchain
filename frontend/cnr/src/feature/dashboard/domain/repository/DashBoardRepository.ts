import { ErrorResponse } from "../../../../services/model/commun";
import { PKI1Response } from "../../data/dtos/DashBoardDtos";

export interface DashBoardRepository {
  GetUplaodFilesPKI(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse>;
}
