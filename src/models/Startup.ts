import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo {
    title: string;
    thumb: string;
    url?: string;
}

export interface IFinancials {
    months: string[];
    revenue: number[];
    netProfit: number[];
    roi: number;
    cac: number;
    ltv: number;
}

export interface IStartup extends Document {
    name: string;
    sector: string;
    businessModel: string;
    requested: number;
    equity: number;
    risk: string;
    score: number;
    revenue: number;
    burn: number;
    desc: string;
    videos: IVideo[];
    financials: IFinancials;
}

const VideoSchema: Schema = new Schema({
    title: { type: String, required: true },
    thumb: { type: String, required: true },
    url: { type: String }
});

const FinancialsSchema: Schema = new Schema({
    months: { type: [String], default: [] },
    revenue: { type: [Number], default: [] },
    netProfit: { type: [Number], default: [] },
    roi: { type: Number, default: 0 },
    cac: { type: Number, default: 0 },
    ltv: { type: Number, default: 0 }
});

const StartupSchema: Schema = new Schema({
    name: { type: String, required: true },
    sector: { type: String, required: true },
    businessModel: { type: String, default: "B2B SaaS" },
    requested: { type: Number, required: true },
    equity: { type: Number, required: true },
    risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    score: { type: Number, default: 80 },
    revenue: { type: Number, required: true },
    burn: { type: Number, required: true },
    desc: { type: String, required: true },
    videos: { type: [VideoSchema], default: [] },
    financials: { type: FinancialsSchema, default: {} }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Avoid recompiling model during Next.js Hot Reloads
export default mongoose.models.Startup || mongoose.model<IStartup>('Startup', StartupSchema);
