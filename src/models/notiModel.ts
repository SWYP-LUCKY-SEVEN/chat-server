import { model } from "mongoose";

import INotiDocument from '@src/models/interfaces/INoti';
import NotiSchema from '@src/models/schemas/notiSchema';

const NotiModel = model<INotiDocument>("Noti", NotiSchema);

export default NotiModel;