import BookList from "@/components/BookList";
export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 pt-26 pb-20 gap-4 sm:p-20">
        <header className="flex w-full md:w-125 h-32 bg-[#758694] rounded-4xl text-5xl md:text-[58px] justify-center items-center">
          <h1>Book Store</h1>
        </header>
        <BookList />
    </div>
  );
}
