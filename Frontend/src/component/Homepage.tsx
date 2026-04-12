import Chatlist from "../pages/chatSection/Chatlist";
import Layout from "./Layout";
import {motion} from 'framer-motion'


export default function Homepage() {
  return (
   <Layout>

    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}} className="h-full">
<Chatlist />
    </motion.div>
   </Layout>
  )
}
