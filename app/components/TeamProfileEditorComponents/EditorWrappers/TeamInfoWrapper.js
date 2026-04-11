import ImageUploader from "../ImageUploader";
import ProfileEntryEditor from "../ProfileEntryEditor";

export default function TeamInfoWrapper({newTeamName,setNewTeamName,teamDescription,setTeamDescription,logoImg,setLogoImg, missingBool}){
    return(
        <>
            <ProfileEntryEditor
              prompt={"Team Name"}
              response={newTeamName}
              setResponse={setNewTeamName}
              placeholder={"Team Name"}
              isLong={false}
              />
              {
                  (missingBool && newTeamName=="")&&
                  <div className="leading-[0px] text-red-500 text-[14px]">
                      Missing team name
                  </div>
              }

              <ProfileEntryEditor
              prompt={"Swim Team Description"}
              response={teamDescription}
              setResponse={setTeamDescription}
              placeholder={"Talk about your swim team's culture, offerings, history, staff etc..."}
              isLong={true}
              />
                 {
                  (missingBool && teamDescription=="")&&
                  <div className="leading-[0px] text-red-500 text-[14px]">
                      Missing team description
                  </div>
              }
              <ImageUploader allowMultiple={false} images={logoImg} setImages={setLogoImg} prompt={"Logo Image"}
              buttonMessage={
                  logoImg.length!=0?"Replace Team Logo Image":"Upload Team Logo Image"}/>
                  {
                  (missingBool && logoImg.length==0)&&
                  <div className="leading-[0px] text-red-500 text-[14px]">
                      Missing logo
                  </div>
              }
              <div
              className="h-[3px]"
              />
        </>
    )
}