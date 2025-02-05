import {PostWithCreator} from "../interfaces/PostWithCreator";
import React, {JSX, useEffect, useState} from "react";
import {Button} from "@heroui/button";
import {
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from "@heroui/react";
import {toast} from "react-toastify";
import {ethers} from "ethers";
import {useContracts} from "../contexts";
import {string} from "yup";
import {useEstimatedGasConditioned} from "../hooks";
import {useGasConvertor} from "../hooks/useGasConvertor";
import {FaGasPump} from "react-icons/fa";

export const DonationCard = ({isOpen, onClose, post}: { post: PostWithCreator }): JSX.Element => {

    const {donationContract, provider} = useContracts();
    const [donationValue, setDonationValue] = useState<number>();
    const [donationCurrency, setDonationCurrency] = useState<string>("ether");
    const [invalidInput, setInvalidInput] = useState<boolean>();
    const currency =[
        {key: "wei", value: "WEI"},
        {key: "gwei", value: "GWEI"},
        {key: "ether", value: "ETH"},
    ];


    const handleDonate = async () => {
        if(!donationValue){
            setInvalidInput(true);
            return;
        }
        try {
            const tx = await toast.promise(donationContract.donate(post.creator, { value: ethers.parseUnits(String(donationValue), donationCurrency) }),
                {success: "Donation successful!", error: "There was an error processing the donation!", pending: "Processing donation!"});
            await tx.wait();
        } catch (err) {
            console.error("There was an error trying to donate:", err);
        }
        onClose();
    };

    const handleClose = () => {
        setDonationValue(undefined);
        setDonationCurrency("ether");
        setInvalidInput(undefined);
        onClose();
    }



    return (
        <Modal isOpen={isOpen} size={"lg"} onClose={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Make a donation to @{post.username}</ModalHeader>
                        <Divider/>

                        <ModalBody className={"gap-3 my-5"}>
                            <p>
                                Help @{post.username} by donating to their cause!
                            </p>
                            <div className={"flex flex-row gap-3"}>
                                <Input
                                    placeholder={"Donation value"}
                                    type="number"
                                    className={"grow-[2]"}
                                    labelPlacement={"outside"}
                                    label="Donation value"
                                    isRequired={true}
                                    classNames={{
                                        base: "grow-3"
                                    }}
                                    onValueChange={(e) => {
                                        setDonationValue(e);
                                        setInvalidInput(false);
                                    }}
                                    isInvalid={invalidInput}
                                    errorMessage={"Please enter a valid donation value!"}
                                ></Input>
                                <Select
                                    variant={"bordered"}
                                    size={"md"}
                                    defaultSelectedKeys={["ether"]}
                                    onChange={(item) => {setDonationCurrency(item.target.value)}}
                                    isRequired={true}
                                >
                                    {currency.map((currency) => (
                                        <SelectItem key={currency.key}>{currency.value}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </ModalBody>
                        <Divider/>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <div>
                                <Button color="primary" onPress={handleDonate}>
                                    Donate
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}