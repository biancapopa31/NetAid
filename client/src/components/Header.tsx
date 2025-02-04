import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar, Skeleton,
} from "@heroui/react";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {SignOutButton} from "@clerk/clerk-react";
import React from "react";
import {NavLink} from "react-router-dom";

export function Header() {

    const {username, profilePictureUrl} = useUserDetails()

    return (
        <Navbar isBordered isBlurred={false}>
            <NavbarBrand>
                <NavLink className="font-bold text-inherit" to={'/home'}>NetAid</NavLink>
            </NavbarBrand>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        {profilePictureUrl ? <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="primary"
                            name={username}
                            size="md"
                            src={profilePictureUrl }
                        />
                            : <Skeleton/>
                        }
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="SignedIn" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{username}</p>
                        </DropdownItem>
                        <DropdownItem key="profile" >
                            <NavLink to={'/home/myProfile'}>My Profile</NavLink>
                            </DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            <SignOutButton>
                                Log Out
                            </SignOutButton>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}
