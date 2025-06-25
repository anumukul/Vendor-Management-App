import mongoose from 'mongoose'

const VendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  bankAccountNo: {
    type: String,
    required: [true, 'Bank account number is required'],
    trim: true
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true
  },
  addressLine1: {
    type: String,
    trim: true,
    default: ''
  },
  addressLine2: {
    type: String,
    required: [true, 'Address Line 2 is required'],
    trim: true
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  zipCode: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})


VendorSchema.index({ createdBy: 1, createdAt: -1 })
VendorSchema.index({ createdBy: 1, bankAccountNo: 1 }, { unique: true })

export const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema)