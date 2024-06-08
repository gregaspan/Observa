import boto3

BUCKET_NAME = "moj-test-bucket"
S3_BASE_URL = f'https://{BUCKET_NAME}.s3.amazonaws.com/'


def upload_file(file_name, bucket):
    object_name = file_name
    s3_client = boto3.client('s3')
    s3_client.upload_file(file_name, bucket, object_name)

    # Generate a presigned URL for the uploaded object
    presigned_url = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket, 'Key': object_name},
                                                     ExpiresIn=3600)
    return presigned_url


def get_video_urls(user_id):
    s3_client = boto3.client('s3')
    response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
    videos = response.get('Contents', [])
    video_urls = [S3_BASE_URL + video['Key'] for video in videos if video['Key'].endswith(f'{user_id}.avi')]
    return video_urls
