import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Form, Button, Checkbox, DatePicker, InputNumber, Upload, Alert } from "antd";
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons';

import {uploadFile, addAlbum} from '../../store/actions';
import type { AppDispatch, State } from '../../types/state';
import { AlbumFormat } from '../../types/enums';
import s from "./new-album.module.css";

type UploadURLType = {
  fullPath: string,
  id: string,
  path: string,
}


const NewAlbum = (): JSX.Element => {
  const [form] = Form.useForm();
  const [uploadStatus, setUploadStatus] = useState('prepared')
  const [uploadUrl, setUploadUrl] = useState<null | string>(null);
  const [submitState, setSubmitState] = useState({
    successVisible: false,
  })

  const genres = useSelector((state:State) => state.SITE_PROCESS.genres);

  const genreOptions = genres.length > 0 && genres.map((genre) => ({ label: genre, value: genre }));

  const albumFormatOptions = Object.keys(AlbumFormat).map((format) => {return {
    label: format,
    value: format,
  }})

  const dispatch = useDispatch<AppDispatch>();

  async function handleFormSubmit (values) {
    const newAlbum = {...values, coverImg: `https://nfejynuraifmrtmngcaa.supabase.co/storage/v1/object/public/${uploadUrl}`, description: [values.description]}
    console.log(newAlbum)
    const result = await dispatch(addAlbum(newAlbum)).unwrap();
    if(result === 'success') {
      return setSubmitState({ successVisible: true })}
    } 

  const handleChange = () => {

  }

  const handleDataChange = () => {

  }

  const handleQuantityChange = () => {

  }

  async function handleBeforeUpload(file: RcFile, ) {
    console.log(file);
    const signedUrl:UploadURLType = await dispatch(uploadFile(file)).unwrap();
    setUploadUrl(signedUrl.fullPath);
    return false;
  }


  if (genres.length === 0) {
    return <div>Loading...</div>
  }
  
  return (
    <div className={s.root}>
      <div className={s.newAlbumWrapper}>
    <h1>Create new album</h1>
    <div className={s.formWrapper}>
      <Form form={form} onFinish={handleFormSubmit}>
        <label className="visually-hidden">Album's title</label>
        <Form.Item name="name">
          <Input
            size="large"
            placeholder="Album title"
            required
            minLength={1}
            maxLength={50}
          />
        </Form.Item>
        <label className="visually-hidden">Who is the artist of the album</label>
        <Form.Item name="musician">
          <Input
            size="large"
            placeholder="Musician"
            required
            minLength={1}
            maxLength={50}
          />
        </Form.Item>
        <label className="visually-hidden">Genres</label>
        <Form.Item name="genres">
          <Checkbox.Group options={genreOptions} defaultValue={['Music genre']}  onChange={handleChange} />
        </Form.Item>
        <label className="visually-hidden">Release Date</label>
        <Form.Item name="releaseDate">
          <DatePicker onChange={handleDataChange} />
        </Form.Item>
        <label className="visually-hidden">How many songs</label>
        <Form.Item name="qtySongs">
          <InputNumber min={1} max={20} defaultValue={6} onChange={handleQuantityChange} />
        </Form.Item>
        <label className="visually-hidden">Download cover for album</label>
        <Form.Item name="coverImg">
          <Upload
            action={uploadUrl as unknown as string}
            method="PUT"
            beforeUpload={handleBeforeUpload}
            onChange={({ file }) => {
              if (file.status === 'done') {
                console.log('File uploaded successfully');
              } else if (file.status === 'error') {
                console.error('File upload failed');
              }
            }}
          >
            {uploadStatus === 'prepared' && <Button icon={<UploadOutlined />}>Upload</Button>}
          </Upload>
        </Form.Item>
        <label className="visually-hidden">Description</label>
        <Form.Item name="description">
          <TextArea rows={8} />
        </Form.Item>
        <label className="visually-hidden">What formats does album has:</label>
        <Form.Item name="format">
          <Checkbox.Group options={albumFormatOptions} defaultValue={['Album formats']}  onChange={handleChange} />
        </Form.Item>
        <Button
              className={s.button}
              htmlType="submit"
            >
              Create new album
            </Button>
      </Form>
      {submitState.successVisible && <Alert
          message="New album created!"
          description="Thanks a lot!"
          type="success"
          onClose={() => setSubmitState({ successVisible: false })}
        />}
    </div>
    </div>
  </div>
)}

export default NewAlbum;