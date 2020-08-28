import React, { useState } from 'react';
import { Row, TextInput, SelectInput, Loader } from '../../UI';
import { Website } from '@devpunk/types';
import { RiAlarmWarningLine } from 'react-icons/ri';
import { addNewWebsite } from '../../../gql';
import {
  Container,
  Logo,
  ButtonFilled,
  ButtonOutlined,
  FileInput,
  ErrorLabel,
} from './style';

const OPTIONS = [
  { name: 'Yes', value: 'true' },
  { name: 'No', value: 'false' },
];

const defaultWebsite = {
  _id: null,
  name: '',
  type: 'RSS',
  website: '',
  order: 10,
  feed: '',
  active: true,
};

interface WebsiteEditProps {
  onClose: () => void;
}

type WebsiteEdit = (props: WebsiteEditProps) => JSX.Element;

const WebsiteEdit: WebsiteEdit = ({ onClose }) => {
  const [image, setImage] = useState<string>(null);
  const [website, setWebsite] = useState<Website>(defaultWebsite);
  const [view, setView] = useState<'HIDDEN' | 'LOADING' | 'ERROR'>('HIDDEN');
  const [error, setError] = useState('');

  const handleInput = (field: string) => (value: string) => {
    setWebsite({
      ...website,
      [field]: value,
    });
  };

  const handleNumberInput = (field: string) => (value: string) => {
    const num = Number(value || 0);
    setWebsite({
      ...website,
      [field]: isNaN(num) ? 0 : num,
    });
  };

  const handleBooleanInput = (field: string) => (value: string) => {
    setWebsite({
      ...website,
      [field]: value === 'true',
    });
  };

  const handleSaveButtonClicked = () => {
    setView('LOADING');
    addNewWebsite(website)
      .then((res) => {
        const documentId = res.addWebsite._id;

        if (image) {
          fetch('http://localhost:3000/api/images', {
            method: 'PUT',
            body: JSON.stringify({
              id: documentId,
              image,
            }),
          }).then(() => {
            setView('HIDDEN');
            onClose();
          });
        } else {
          setView('HIDDEN');
          onClose();
        }
      })
      .catch((e) => {
        setView('ERROR');
        setError(e.message);
      });
  };

  const handleImageChange = (e) => {
    const input = e.target;

    if (!input.files.length) {
      setImage(null);
    } else if (
      input.files.length &&
      input.files[0]?.type.indexOf('image') !== -1
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result.toString());
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      console.error('Pick a valid Image file');
    }
  };

  return (
    <Container>
      <Row size="1fr 4fr">
        <Logo image={image}>
          <FileInput type="file" onChange={handleImageChange} />
        </Logo>
        <Row size="1fr">
          <TextInput
            label="Name"
            value={website.name}
            onChange={handleInput('name')}
          />
          <TextInput
            label="Link"
            value={website.website}
            onChange={handleInput('website')}
          />
        </Row>
      </Row>
      <Row size="1fr">
        <TextInput
          label="Feed URL"
          value={website.feed}
          onChange={handleInput('feed')}
        />
        <Row size="5fr 1fr 5fr">
          <TextInput
            label="Order"
            value={website.order + ''}
            onChange={handleNumberInput('order')}
          />
          <div></div>
          <SelectInput
            label="Active"
            options={OPTIONS}
            value={website.active + ''}
            onChange={handleBooleanInput('active')}
          />
        </Row>
      </Row>
      <br></br>
      <Row size="4fr 1fr 1fr">
        <div>
          {view === 'LOADING' && <Loader />}
          {view === 'ERROR' && (
            <ErrorLabel>
              <RiAlarmWarningLine fontSize="24" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>{error}</span>
            </ErrorLabel>
          )}
        </div>
        <ButtonOutlined onClick={onClose}>Cancel</ButtonOutlined>
        <ButtonFilled onClick={handleSaveButtonClicked}>Save</ButtonFilled>
      </Row>
    </Container>
  );
};

export default WebsiteEdit;
