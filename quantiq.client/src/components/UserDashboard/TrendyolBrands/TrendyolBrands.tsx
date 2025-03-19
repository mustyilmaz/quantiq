import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface Brand {
  id: number;
  name: string;
}

interface BrandResponse {
  brands?: Brand[];
  message?: string;
}

const PAGE_SIZE = 1000; // Trendyol API'si bir sayfada minimum 1000 marka dönüyor

const TrendyolBrands = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // Daha fazla sayfa olup olmadığını kontrol etmek için

  useEffect(() => {
    document.title = "Quantiq - Trendyol Markaları";
  }, []);

  // URL parametrelerini güncelle
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    if (page !== 1) {
      params.set('page', page.toString());
    }
    
    setSearchParams(params);
  }, [searchTerm, page, setSearchParams]);

  // Markaları getir
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        setSearchMessage(null);
        
        if (searchTerm.trim()) {
          // Arama yapılıyorsa
          const response = await axios.get<BrandResponse>(`/api/Trendyol/brands-by-name?name=${encodeURIComponent(searchTerm)}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data && 'message' in response.data) {
            setSearchMessage(response.data.message || null);
            setFilteredBrands(response.data.brands || []);
          } else {
            setFilteredBrands(response.data as Brand[]);
          }
          setHasMore(false); // Arama yaparken sayfalama olmayacak
        } else {
          // Normal sayfalı listeleme
          const response = await axios.get<BrandResponse>(`/api/Trendyol/brands?page=${page}&size=${PAGE_SIZE}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data && Array.isArray(response.data.brands)) {
            setFilteredBrands(response.data.brands);
            // Eğer gelen veri sayısı PAGE_SIZE'dan azsa, daha fazla sayfa yoktur
            setHasMore(response.data.brands.length === PAGE_SIZE);
          } else {
            setFilteredBrands([]);
            setError('Geçersiz veri formatı');
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError('Markalar yüklenirken bir hata oluştu.');
        setFilteredBrands([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [page, searchTerm]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    setSearchTerm(searchValue.trim());
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading && !filteredBrands.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-color"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Trendyol Markalar</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="search"
            name="search"
            placeholder="Marka ara... (Aramak için Enter'a basın)"
            defaultValue={searchTerm}
            className="w-full p-3 pl-10 rounded-lg bg-bg-secondary border border-border-color focus:outline-none focus:border-accent-color"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-accent-color text-white rounded hover:bg-opacity-90"
          >
            Ara
          </button>
          <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
        </form>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 mb-4">
          {error}
        </div>
      )}

      {searchMessage && (
        <div className="text-amber-500 text-center p-4 mb-4">
          {searchMessage}
        </div>
      )}

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-color"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="p-4 bg-bg-secondary rounded-lg border border-border-color hover:border-accent-color transition-colors"
          >
            <p className="text-text-primary font-medium">{brand.name}</p>
            <p className="text-text-secondary text-sm mt-1">ID: {brand.id}</p>
          </div>
        ))}
      </div>

      {!searchTerm && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg border border-border-color hover:border-accent-color disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki Sayfa
          </button>
          <span className="px-4 py-2">Sayfa {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={loading || !hasMore}
            className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg border border-border-color hover:border-accent-color disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki Sayfa
          </button>
        </div>
      )}

      {filteredBrands.length === 0 && !loading && !searchMessage && (
        <div className="text-center p-8 text-text-secondary">
          Marka bulunamadı
        </div>
      )}
    </div>
  );
};

export default TrendyolBrands;
