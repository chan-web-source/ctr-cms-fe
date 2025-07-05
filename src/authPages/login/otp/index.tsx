// @ts-nocheck

import * as React from 'react';
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import {
    Grid,
} from '@mui/material';



interface OTPProps {
    separator?: React.ReactNode;
    length: number;
    value: string;
    onChange: (value: string) => void;
}

const OTP = ({ separator, length, value, onChange }: OTPProps) => {
    const inputRefs = React.useRef(new Array(length).fill(null));

    const focusInput = (targetIndex: number) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.focus();
    };

    const selectInput = (targetIndex: number) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.select();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
                event.preventDefault();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Delete':
                event.preventDefault();
                onChange(((prevOtp: string): string => {
                    const otp =
                        prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                }) as unknown as string);

                break;
            case 'Backspace':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }

                onChange(((prevOtp: string): string => {
                    const otp =
                        prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                }) as unknown as string);
                break;

            default:
                break;
        }
    };

    const handleChange = (event, currentIndex) => {
        const currentValue = event.target.value;
        let indexToEnter = 0;

        while (indexToEnter <= currentIndex) {
            if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                indexToEnter += 1;
            } else {
                break;
            }
        }
        onChange((prev) => {
            const otpArray = prev.split('');
            const lastValue = currentValue[currentValue.length - 1];
            otpArray[indexToEnter] = lastValue;
            return otpArray.join('');
        });
        if (currentValue !== '') {
            if (currentIndex < length - 1) {
                focusInput(currentIndex + 1);
            }
        }
    };

    const handleClick = (event, currentIndex) => {
        selectInput(currentIndex);
    };

    const handlePaste = (event, currentIndex) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;

        // Check if there is text data in the clipboard
        if (clipboardData.types.includes('text/plain')) {
            let pastedText = clipboardData.getData('text/plain');
            pastedText = pastedText.substring(0, length).trim();
            let indexToEnter = 0;

            while (indexToEnter <= currentIndex) {
                if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                    indexToEnter += 1;
                } else {
                    break;
                }
            }

            const otpArray = value.split('');

            for (let i = indexToEnter; i < length; i += 1) {
                const lastValue = pastedText[i - indexToEnter] ?? ' ';
                otpArray[i] = lastValue;
            }

            onChange(otpArray.join(''));
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                gap: '1.25rem',
                width: 'fit-content',
                margin: '0 auto'
            }}
        >
            {new Array(length).fill(null).map((_, index) => (
                <React.Fragment key={index}>
                    <BaseInput
                        slots={{
                            input: InputElement,
                        }}
                        sx={{
                            '& input': {
                                width: '48px',
                                height: '48px',
                                fontSize: '1.25rem',
                                padding: 0,
                                fontWeight: '500'
                            }
                        }}
                        aria-label={`Digit ${index + 1} of OTP`}
                        slotProps={{
                            input: {
                                ref: (ele) => {
                                    inputRefs.current[index] = ele;
                                },
                                onKeyDown: (event) => handleKeyDown(event, index),
                                onChange: (event) => handleChange(event, index),
                                onClick: (event) => handleClick(event, index),
                                onPaste: (event) => handlePaste(event, index),
                                value: value[index] ?? '',
                            },
                        }}
                    />
                    {index === length - 1 ? null : separator}
                </React.Fragment>
            ))}
        </Box>
    );
}

OTP.propTypes = {
    length: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    separator: PropTypes.node,
    value: PropTypes.string.isRequired,
};


const InputElement = styled('input')(
    ({ theme }) => `
            width: 48px;
            height: 48px;
            font-family: inherit;
            font-size: 1.25rem;
            font-weight: 500;
            padding: 0;
            border-radius: 8px;
            text-align: center;
            white-space: nowrap;
            flex-shrink: 0;
            
            color: #111827;
            background: #fff;
            border: 1px solid #E5E7EB;
            box-shadow: none;

            &:hover {
                border-color: #B8860B;
            }

            &:focus {
                border-color: #B8860B;
                box-shadow: none;
                outline: none;
            }

            // firefox
            &:focus-visible {
                outline: none;
            }
`,
);



export default function OTPInput({ otp, setOTP }) {
    return (
        <Grid
            item
            sx={{
                display: 'flex',
                justifyContent: 'center',
                marginY: 2,
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}
            >
                <OTP
                    separator={<span></span>}
                    value={otp}
                    onChange={setOTP}
                    length={4}
                />
            </Box>
        </Grid>
    );
}