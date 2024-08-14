import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Input, Form, Button, Checkbox, DatePicker, InputNumber, Upload, Alert } from "antd";
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons';

import {uploadFile,fetchAlbumById, updateAlbum} from '../../store/actions';
import type { AppDispatch, State } from '../../types/state';
import { AlbumFormat } from '../../types/enums';
import { IMG_UPLOAD_URL } from '../../const';
import s from './edit-album.module.css';


type UploadURLType = {
  fullPath: string,
  id: string,
  path: string,
}

const EditAlbum = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const albumState = useSelector((state: State) => state.SITE_PROCESS.album);
  const genres = useSelector((state: State) => state.SITE_PROCESS.genres);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [uploadStatus, setUploadStatus] = useState('prepared');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [submitState, setSubmitState] = useState({
    successVisible: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchAlbumById(id));
    }
  }, [dispatch, id]);

  const genreOptions = genres.length > 0 && genres.map((genre) => ({ label: genre, value: genre }));
  
  const albumFormatOptions = Object.keys(AlbumFormat).map((format) => ({
    label: format,
    value: format,
  }));

  async function handleFormSubmit(values) {
    console.log(values)
    const albumData = {
      ...values,
      coverImg: `https://nfejynuraifmrtmngcaa.supabase.co/storage/v1/object/public/${uploadUrl}`,
      description: [...values.description],
    };
    const result = await dispatch(updateAlbum({albumData: albumData, id: id as string}));
    if (updateAlbum.fulfilled.match(result)) {
      // Успешное выполнение, делаем редирект на страницу компонента
      navigate(`/album/${id}`);
    } else if (updateAlbum.rejected.match(result)) {
      // Обработка ошибки, показываем Alert с сообщением об ошибке
      setErrorMessage(result.error.message || 'Ошибка при обновлении альбома');
    }
  }

  async function handleBeforeUpload(file: RcFile) {
    const signedUrl: UploadURLType = await dispatch(uploadFile(file)).unwrap();
    setUploadUrl(signedUrl.fullPath);
    return false;
  }

  if (!albumState || genres.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={s.root}>
      {errorMessage && <Alert message={errorMessage} type="error" />}
      <div className={s.newAlbumWrapper}>
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
            <Form.Item name="name">
              <Input
                size="large"
                placeholder="Album title"
                required
                minLength={1}
                maxLength={50}
              />
            </Form.Item>
            <Form.Item name="musician">
              <Input
                size="large"
                placeholder="Musician"
                required
                minLength={1}
                maxLength={50}
              />
            </Form.Item>
            <Form.Item name="genres">
              <Checkbox.Group options={genreOptions} />
            </Form.Item>
            <Form.Item name="releaseDate">
              <DatePicker />
            </Form.Item>
            <Form.Item name="qtySongs">
              <InputNumber min={1} max={20} />
            </Form.Item>
            <Form.Item name="coverImg">
              <Upload
                action={uploadUrl as unknown as string}
                method="PUT"
                beforeUpload={handleBeforeUpload}
                defaultFileList={[{
                  uid: '-1', 
                  name: `${albumState.coverImg.replace(IMG_UPLOAD_URL, '')}`,
                  status: 'done',
                  url: `${albumState.coverImg}`, 
                  }]}
              >
                {uploadStatus === 'prepared' && <Button icon={<UploadOutlined />}>Upload</Button>}
              </Upload>
            </Form.Item>
            <Form.Item name="description">
              <TextArea rows={8} />
            </Form.Item>
            <Form.Item name="format">
              <Checkbox.Group options={albumFormatOptions} />
            </Form.Item>
            <Button className={s.button} htmlType="submit">
              Update album
            </Button>
          </Form>
          {submitState.successVisible && (
            <Alert
              message="Album updated"
              description="Thanks a lot!"
              type="success"
              onClose={() => setSubmitState({ successVisible: false })}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default EditAlbum;
