import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="w-3/4 mx-auto text-white grid grid-cols-2">
      <Image src="https://firebasestorage.googleapis.com/v0/b/yekna-diplomski.appspot.com/o/images%2Fgruv-coffee-2.png?alt=media&token=9be1bde4-1012-4f75-a93b-653aea012d9f" width={1000} className="w-full" height={1000} alt="kurcina" />
      <div>asdjsjdjads</div>
      <div>akdsadskadskkdsk</div>
      <Image src="https://firebasestorage.googleapis.com/v0/b/yekna-diplomski.appspot.com/o/images%2Fgruv-coffee-2.png?alt=media&token=9be1bde4-1012-4f75-a93b-653aea012d9f" width={1000} height={1000} className="w-full" alt="kurcina" />
    </div>
  );
}
