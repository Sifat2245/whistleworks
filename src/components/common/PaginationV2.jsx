import { cn } from "@/lib/utils"
import { Pagination } from 'antd';
const PaginationV2 = ({ handlePageClick, perPage, totalItem, currentPage, variant }) => {
    return (
        <div className={cn("mx-auto flex justify-center items-center mt-4 w-full ", variant)}>
            <Pagination showSizeChanger={false} onChange={handlePageClick} showLessItems defaultCurrent={currentPage} pageSize={perPage} total={totalItem} />
        </div>
    )
}

export default PaginationV2
