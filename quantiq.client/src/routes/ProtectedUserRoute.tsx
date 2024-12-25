import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/AuthServiceforClient';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const verifyResponse = await authService.verifyToken();
                if(verifyResponse){
                    setIsAuthenticated(true);
                }
                else{
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.log("protected route error: ", error);
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        // Yükleniyor durumu için bir loading component gösterilebilir
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        return <Navigate to="/user/login" replace />;
    }

    // Kullanıcı doğrulanmışsa içeriği göster
    return <>{children}</>;
};

export default ProtectedRoute;