import styled from 'styled-components';
import AppIcon from '../../../assets/logo.png';

const Container = styled.div``;

const Logo = styled.div<{ image: string }>`
  width: 80px;
  height: 80px;
  background-size: contain;
  background-image: url(${(prop) => prop.image || AppIcon});
  background-color: #f9f9f9;
  cursor: pointer;
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
`;

const ButtonFilled = styled.button`
  outline: none;
  border: none;
  background-color: #ff9400;
  margin-left: 15px;
  padding: 7px 20px;
  border-radius: 5px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #e88906;
  }
`;

const ButtonOutlined = styled.button`
  outline: none;
  border: none;
  margin-left: 15px;
  padding: 7px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d4d2d2;
  }
`;

const FileInput = styled.input`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  height: 80px;
  cursor: pointer;
  opacity: 0;
`;

const ErrorLabel = styled.div`
  padding: 15px 20px;
  color: #ff7675;
  padding: 6px 0px;
  font-size: 14px;
  font-wight: bold;
  display: flex;
  align-items: flex-end;
`;

export { Container, Logo, ButtonFilled, ButtonOutlined, FileInput, ErrorLabel };
