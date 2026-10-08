import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
}, { _id: false });

const guideSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  body: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, required: true },
}, { timestamps: true, versionKey: false });

const folderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  normalizedName: { type: String, required: true },
  parentId: { type: String, default: null },
  ownerId: { type: String, required: true, index: true },
}, { timestamps: true, versionKey: false });
folderSchema.index({ ownerId: 1, parentId: 1, normalizedName: 1 }, { unique: true });

const reviewSetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  folderId: { type: String, default: null },
  cardCount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["ready"], default: "ready" },
  ownerId: { type: String, required: true, index: true },
}, { timestamps: true, versionKey: false });

const studySetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, default: "General" },
  description: { type: String, default: "" },
  examDate: { type: String, default: null },
  cards: { type: [cardSchema], default: [] },
  guide: { type: [guideSectionSchema], default: [] },
  updatedAt: { type: String, required: true },
}, { versionKey: false });

export const User = mongoose.models.PassifyUser || mongoose.model("PassifyUser", userSchema);
export const Folder = mongoose.models.PassifyFolder || mongoose.model("PassifyFolder", folderSchema);
export const ReviewSet = mongoose.models.PassifyReviewSet || mongoose.model("PassifyReviewSet", reviewSetSchema);
export const StudySet = mongoose.models.PassifyStudySet || mongoose.model("PassifyStudySet", studySetSchema);

let connectionPromise;

export function connectDatabase() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required to connect to MongoDB Atlas");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to a random string of at least 32 characters");
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => mongoose.connection)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }
  return connectionPromise;
}
