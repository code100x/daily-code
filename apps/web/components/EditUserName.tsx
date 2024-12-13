'use client'

import { CheckIcon, Cross1Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { Button, Input, Label } from '@repo/ui'
import React, { FormEvent, useState } from 'react'
import { updateUserName } from './utils'

export const EditUserName = ({ userName, userId }: { userName: string, userId: string }) => {
    const [isDisable, setIsDisable] = useState<boolean>(true);
    const [nameInput, setNameInput] = useState<string>('');
    const clickHandler = (e: FormEvent) => {
        e.preventDefault();
        setIsDisable(!isDisable)
    }
    const updateHandler = async(e: FormEvent)=>{
        e.preventDefault();
        await updateUserName(userId, nameInput);
        setIsDisable(!isDisable)
    }

    return (
        <>
            <div>
                <div className="flex gap-1 items-center">
                    <Label className="">Your name</Label>
                    {isDisable ? (<Button variant='ghost' onClick={clickHandler}>
                        <Pencil1Icon />
                    </Button>) : (
                        <div className="flex gap-1 items-center">
                            <Button variant='ghost' onClick={updateHandler}>
                                <CheckIcon />
                            </Button>
                            <Button variant='ghost' onClick={clickHandler}>
                                <Cross1Icon />
                            </Button>
                        </div>
                    )}
                </div>
                <Input disabled={isDisable} placeholder="Enter your name" value={isDisable ? userName : nameInput} className="p-2 mt-2" onChange={(e)=>{setNameInput(e.target.value)}} />
            </div>
        </>
    )
}
