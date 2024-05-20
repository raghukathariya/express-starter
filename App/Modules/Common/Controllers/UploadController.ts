import { UploadService } from "../Services/UploadService";
import {
  Req,
  Res,
  Get,
  UseBefore,
  Param,
  Post,
  Delete,
  JsonController,
  UploadedFile,
} from "routing-controllers";
import { AuthMiddleware } from "../../Auth/Middlewares/AuthMiddleware";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { fileUploadOptions } from "../Requests/FileUploadOptions";
import { Upload } from "../Models/Upload";
import { Inject, Service } from "typedi";

@Service()
@UseBefore(AuthMiddleware)
@JsonController("/upload")
export class UploadController {
  constructor(@Inject() private uploadsService: UploadService) {}

  @Get("/")
  async getAll(@Req() req: any, @Res() res: any) {
    try {
      const uploads = await this.uploadsService.findAll();
      if (uploads.length > 0) {
        return res
          .status(HttpStatus.OK)
          .json({ data: uploads, message: "Success" });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: [], message: "Failed" });
      }
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({ message: "failed" });
    }
  }

  @Get("/:id")
  async getById(
    @Param("id") id: string,
    @Req() req: any,
    @Res() res: any
  ): Promise<Upload | null> {
    try {
      const upload: Upload = await this.uploadsService.findById(id);
      if (upload) {
        return res
          .status(HttpStatus.OK)
          .json({ data: upload, message: "Success" });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "Failed" });
      }
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({ message: "Failed" });
    }
  }

  @Post("/file")
  async upload(
    @UploadedFile("fileName", { options: fileUploadOptions }) file: any,
    @Res() res: any
  ): Promise<any> {
    try {
      console.log("DATA", file);
      const uploadResult = await this.uploadsService.save(file);

      if (uploadResult) {
        return res.status(HttpStatus.OK).json({
          message: `File named ${file.originalname} uploaded successfully `,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({
        message:
          "Something went wrong. Please contact system Administrator." + error,
      });
    }
  }

  @Delete("/:id")
  async delete(@Param("id") id: string, @Res() res: any): Promise<void> {
    try {
      await this.uploadsService.delete(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: `File deleted successfully ` });
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({
        message: "Something went wrong. Please contact system Administrator.",
      });
    }
  }
}

// App/Modules/Upload/Controllers/UploadController.ts
