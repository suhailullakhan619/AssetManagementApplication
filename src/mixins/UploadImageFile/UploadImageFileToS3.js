import { uploadData, getUrl } from 'aws-amplify/storage'

export const UploadDataToS3 = async (file) => {
  const fileKey = `assets/${Date.now()}-${file.name}`

  await uploadData({
    path: fileKey,
    data: file,
    options: {
      contentType: file.type
    }
  }).result

  return fileKey
}

export const getImageUrl = async (key) => {
  const url = await getUrl({
    path: key,
  })
  return url.url.toString()
}