
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DemoLoginHelperProps {
  fillLoginForm: (userType: string) => void;
}

export const DemoLoginHelper: React.FC<DemoLoginHelperProps> = ({ fillLoginForm }) => {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <p className="text-xs text-gray-500 text-center mb-2">
        Para fins de demonstração, você pode usar:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {['admin', 'student', 'lawyer', 'client'].map((type) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillLoginForm(type)}
              className="text-xs transition-all duration-300 hover:bg-npj-blue/10"
            >
              {type === 'admin' ? 'Admin' : 
               type === 'student' ? 'Estudante' : 
               type === 'lawyer' ? 'Advogado' : 'Cliente'}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
