<?php

namespace Web\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Favoris
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Web\MainBundle\Entity\FavorisRepository")
 */
class Favoris
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="nomStation", type="string", length=255)
     */
    private $nomStation;

    /**
     * @var string
     *
     * @ORM\Column(name="slugNomStation", type="string", length=255)
     */
    private $slugNomStation;
    /**
    *
    * @ORM\ManyToMany(targetEntity="Web\UserBundle\Entity\User", cascade={"persist"})
    */
    private $user;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nomStation
     *
     * @param string $nomStation
     * @return Favoris
     */
    public function setNomStation($nomStation)
    {
        $this->nomStation = $nomStation;
    
        return $this;
    }

    /**
     * Get nomStation
     *
     * @return string 
     */
    public function getNomStation()
    {
        return $this->nomStation;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->user = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add user
     *
     * @param \Web\UserBundle\Entity\User $user
     * @return Favoris
     */
    public function addUser(\Web\UserBundle\Entity\User $user)
    {
        $this->user[] = $user;
    
        return $this;
    }

    /**
     * Remove user
     *
     * @param \Web\UserBundle\Entity\User $user
     */
    public function removeUser(\Web\UserBundle\Entity\User $user)
    {
        $this->user->removeElement($user);
    }

    /**
     * Get user
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set slugNomStation
     *
     * @param string $slugNomStation
     * @return Favoris
     */
    public function setSlugNomStation($slugNomStation)
    {
        $this->slugNomStation = $slugNomStation;
    
        return $this;
    }

    /**
     * Get slugNomStation
     *
     * @return string 
     */
    public function getSlugNomStation()
    {
        return $this->slugNomStation;
    }
}