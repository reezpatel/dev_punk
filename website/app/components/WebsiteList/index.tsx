import React, { useState, useEffect } from 'react';
import {
  WebsiteContainer,
  Title,
  WebsiteItem,
  WebsiteIcon,
  WebsiteText,
  WebsiteAction,
} from './style';
import { Website } from '@devpunk/types';
import { TiPin, TiPinOutline } from 'react-icons/ti';

interface WebsiteListProps {
  websites: Website[];
  selected: number;
  pinned: string[];
  onChange: (index: number) => void;
  onPinsChange: (pins: string[]) => void;
  showPins: boolean;
}

type WebsiteList = (props: WebsiteListProps) => JSX.Element;

const WebsiteList: WebsiteList = ({
  websites,
  selected,
  onChange,
  pinned,
  onPinsChange,
  showPins,
}) => {
  const handleWebsiteSelection = (index) => () => {
    onChange(index);
  };

  const [pinnedWebsite, setPinnedWebsite] = useState(pinned);
  const [websiteList, setWebsiteList] = useState(websites);

  const handleButtonPin = (id: string) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (pinnedWebsite.includes(id)) {
      const index = pinnedWebsite.indexOf(id);
      setPinnedWebsite(
        pinnedWebsite.slice(0, index).concat(pinnedWebsite.slice(index + 1))
      );
    } else {
      setPinnedWebsite([...pinnedWebsite, id]);
    }
  };

  const sortWebsiteList = () => {
    const pins = [];
    const unpins = [];

    for (const site of websites) {
      if (pinnedWebsite.includes(site._id)) {
        pins.push(site);
      } else {
        unpins.push(site);
      }
    }

    setWebsiteList([...pins, ...unpins]);
  };

  useEffect(() => {
    sortWebsiteList();
    onPinsChange(pinnedWebsite);
  }, [pinnedWebsite, websites]);

  return (
    <WebsiteContainer>
      <Title>Feeds</Title>
      {0 !== websiteList.length &&
        websiteList.map((website, index) => (
          <WebsiteItem
            selected={index === selected}
            key={website._id}
            onClick={handleWebsiteSelection(index)}
          >
            <WebsiteIcon
              src={`http://localhost:3000/api/images/website/${website._id}`}
            ></WebsiteIcon>
            <WebsiteText>{website.name}</WebsiteText>
            {showPins && (
              <WebsiteAction onClick={handleButtonPin(website._id)}>
                {pinnedWebsite.includes(website._id) ? (
                  <TiPin />
                ) : (
                  <TiPinOutline />
                )}
              </WebsiteAction>
            )}
          </WebsiteItem>
        ))}
    </WebsiteContainer>
  );
};

export default WebsiteList;
