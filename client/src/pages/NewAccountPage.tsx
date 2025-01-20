import * as Yup from 'yup';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useState} from "react";
import {pinata} from "../utils/config";
import {useContracts} from "../contexts/ContractsContext";
import {useNavigate} from "react-router";
import {useUserDetails} from "../contexts/UserDetailsContext";

const newAccountSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    bio: Yup.string(),
    profilePicture: Yup.mixed()
        .nullable()
        .test('fileType', 'Unsupported file format', (value) => {
            if (value) {
                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                return validTypes.includes(value.type);
            }
            return true;
        }),
});


export function NewAccountPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const {userProfileContract} = useContracts();
    const [usernameTaken, setUsernameTaken] = useState(false);
    const {setUsername, setBio, setAccountInitialized, setProfilePictureCdi, accountInitialized} = useUserDetails();
    const navigate = useNavigate();

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
    };

    const handleSubmit = async (values) =>{
        setUsernameTaken( await userProfileContract.existsUserByUserId(values.username));

        if(usernameTaken){
            return;
        }

        //TODO see how can we handle errors from blockchain
        if(selectedFile){
            try{
                const upload = await pinata.upload.file(selectedFile);

                await userProfileContract.createNewProfile(values.username, values.bio, upload.IpfsHash);
                setProfilePictureCdi(upload.IpfsHash);
            }catch(err){
                console.error("There was an error creating the account",err);
                return;
            }
        }else {
            try {
                await userProfileContract.createNewProfile(values.username, values.bio, '');

            }catch(err){
                console.error("There was an error creating the account",err);
                return;
            }
        }
        setUsername(values.username);
        setBio(values.bio);
        setAccountInitialized(true);
        navigate("/home");

    }

    return (
        <div>
            <p>New Account</p>

            <Formik
                initialValues={{
                    username: '',
                    bio: '',
                    profilePicture: null,
                }}
                validationSchema={newAccountSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="username">Username</label>
                            <Field
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                            />
                            <ErrorMessage name="username" component="div" />
                            {usernameTaken && (<div>Username is already taken!</div>)}
                        </div>

                        <div>
                            <label htmlFor="bio">Bio</label>
                            <Field
                                id="bio"
                                name="bio"
                                as="textarea"
                                placeholder="Tell us about yourself"
                            />
                            <ErrorMessage name="bio" component="div" className="error" />
                        </div>

                        <div>
                            <label htmlFor="profilePicture">Profile Picture</label>
                            <input
                                id="profilePicture"
                                name="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files ? event.target.files[0] : null;
                                    setFieldValue('profilePicture', file); // Update Formik state
                                    setSelectedFile(file); // Update local state
                                }}
                            />
                            {selectedFile && (
                                <div>
                                    <p>Selected file: {selectedFile.name}</p>
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Selected preview"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                </div>
                            )}
                            <ErrorMessage name="profilePicture" component="div" className="error" />
                        </div>

                        <div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Create Account'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}