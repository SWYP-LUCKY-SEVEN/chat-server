import { Schema, model } from "mongoose";

import IPictureDocument from "@src/models/interfaces/IPicture";
import PictureSchema from "./schemas/pictureModel";

const Picture = model("Picture", PictureSchema);
export default Picture;