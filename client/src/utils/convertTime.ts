import deployment from '../utils/deployment.json';

export  const convertTime = (time: BigInt) => {
    return new Date( Number(time)/1000 + deployment.deploymentTime*1000).toLocaleString('en-US', {})
}