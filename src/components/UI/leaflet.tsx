import { useEffect, useRef, ReactNode, Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

export default function Leaflet({
  setShow,
  children,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  const leafletRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const transitionProps = { type: "spring", stiffness: 500, damping: 60 };

  useEffect(() => {
    controls.start({
      y: 0,
      transition: transitionProps,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDragEnd(_: any, info: any) {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = leafletRef.current?.getBoundingClientRect().height || 0;
    
    if (offset > height / 2 || velocity > 800) {
      await controls.start({ y: "100%", transition: transitionProps });
      setShow(false);
    } else {
      controls.start({ y: 0, transition: transitionProps });
    }
  }

  async function closeLeaflet() {
    await controls.start({
      y: "100%",
      opacity: 0,
      transition: transitionProps,
    });
    setShow(false);
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={leafletRef}
        key="leaflet"
        className="group fixed inset-x-0 bottom-0 z-40 w-screen cursor-grab bg-white dark:bg-gray-850 rounded-t-2xl active:cursor-grabbing sm:hidden p-3"
        initial={{ y: "100%" }}
        animate={controls}
        exit={{ y: "100%" }}
        transition={transitionProps}
        drag="y"
        dragDirectionLock
        onDragEnd={handleDragEnd}
        dragElastic={{ top: 0, bottom: 1 }}
        dragConstraints={{ top: 0, bottom: 0 }}
      >     
      <div className="overflow-y-auto"> 
      <motion.div
      drag="y" 
      dragConstraints={{ top: 0, bottom: 0 }}
      > 
        {children}
      </motion.div>
      </div>
      </motion.div>
      <motion.div
        key="leaflet-backdrop"
        className="fixed inset-0 z-30 bg-black bg-opacity-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeLeaflet}
      />
    </AnimatePresence>
  );
}
