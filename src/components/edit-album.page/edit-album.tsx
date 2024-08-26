import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Input,
  Form,
  Button,
  Checkbox,
  DatePicker,
  InputNumber,
  Upload,
  Alert,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

import { Loader } from '../loader/loader';
import { uploadFile, fetchAlbumById, updateAlbum } from '../../store/actions';
import type { AppDispatch, State } from '../../types/state';
import { AlbumFormat } from '../../types/enums';
import { IMG_UPLOAD_URL } from '../../const';
import s from './edit-album.module.css';
import { Album } from '../../types/types';


type UploadURLType = {
  fullPath: string;
  id: string;
  path: string;
};

const EditAlbum = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const albumState = useSelector((state: State) => state.SITE_PROCESS.album);
  const genres = useSelector((state: State) => state.SITE_PROCESS.genres);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [uploadStatus, setUploadStatus] = useState<
    'prepared' | 'loading' | 'loaded' | 'error'
  >('loaded');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAlbumById(id));
    }
  }, [dispatch, id]);

  const genreOptions =
    genres.length > 0 &&
    genres.map((genre) => ({ label: genre, value: genre }));

  const albumFormatOptions = Object.keys(AlbumFormat).map((format) => ({
    label: format,
    value: format,
  }));

  async function handleFormSubmit(values: Album) {
    setIsLoading(true);
    const albumData = {
      ...values,
      coverImg: `https://nfejynuraifmrtmngcaa.supabase.co/storage/v1/object/public/${uploadUrl}`,
      description: [...values.description],
    };
    const result = await dispatch(
      updateAlbum({ albumData: albumData, id: id as string })
    );
    if (updateAlbum.fulfilled.match(result)) {
      navigate(`/album/${id}`);
      setIsLoading(false);
    } else if (updateAlbum.rejected.match(result)) {
      setIsLoading(false);
      setErrorMessage(result.error.message || 'Ошибка при обновлении альбома');
    }
  }

  function handleRemove() {
    setUploadStatus('prepared');
    return true;
  }

  async function handleBeforeUpload(file: RcFile) {
    setUploadStatus('loading');
    const signedUrl: UploadURLType = await dispatch(uploadFile(file)).unwrap();
    console.log(signedUrl)
    setUploadUrl(signedUrl.fullPath);
    setUploadStatus('loaded');
    return false;
  }

  if (!albumState || genres.length === 0) {
    return <Loader />;
  }

  return (
    <div className={s.root}>
      {errorMessage && <Alert message={errorMessage} type="error" />}
      <div className={s.albumWrapper}>
        {console.log(uploadUrl)}
        <h1>
          Edit album: {albumState.name} | {albumState.musician}
        </h1>
        <div className={s.formWrapper}>
          <Form
            form={form}
            onFinish={handleFormSubmit}
            initialValues={{
              name: albumState.name,
              genres: albumState.genres,
              format: albumState.format,
              qtySongs: albumState.qtySongs,
              musician: albumState.musician,
              description: albumState.description,
              releaseDate: moment(albumState.releaseDate),
            }}
          >
            <label>Album's title</label>
            <Form.Item name="name">
              <Input
                size="large"
                placeholder="Album title"
                required
                minLength={1}
                maxLength={50}
              />
            </Form.Item>
            <label>Who is the artist of the album</label>
            <Form.Item name="musician">
              <Input
                size="large"
                placeholder="Musician"
                required
                minLength={1}
                maxLength={50}
              />
            </Form.Item>
            <label>Genres:</label>
            <Form.Item name="genres">
              <Checkbox.Group options={genreOptions} />
            </Form.Item>
            <label>Release Date</label>
            <Form.Item name="releaseDate">
              <DatePicker />
            </Form.Item>
            <label>How many songs</label>
            <Form.Item name="qtySongs">
              <InputNumber min={1} max={20} />
            </Form.Item>
            <label>Download cover for album</label>
            <Form.Item name="coverImg">
              <Upload
                action={uploadUrl as unknown as string}
                method="PUT"
                onRemove={handleRemove}
                beforeUpload={handleBeforeUpload}
                defaultFileList={[
                  {
                    uid: '-1',
                    name: `${albumState.coverImg.replace(IMG_UPLOAD_URL, '')}`,
                    status: 'done',
                    url: `${albumState.coverImg}`,
                  },
                ]}
              >
                  <Button
                    icon={
                      uploadStatus === 'loading' ? (
                        <LoadingOutlined />
                      ) : (
                        <UploadOutlined />
                      )
                    }
                    disabled={uploadStatus !== 'prepared'}
                  >
                    Upload
                  </Button>
              </Upload>
            </Form.Item>
            <label>Description</label>
            <Form.Item name="description">
              <TextArea rows={8} />
            </Form.Item>
            <label>What formats does album has:</label>
            <Form.Item name="format">
              <Checkbox.Group options={albumFormatOptions} />
            </Form.Item>
            <Button className={s.button} htmlType="submit">
              Update album
            </Button>
          </Form>
          {isLoading && (
            <div className={s.loadingScreen}>
              <div className={s.loadingIcon}>
                <LoadingOutlined
                  className={s.loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAlbum;
