<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Web\MainBundle\Entity\Favoris;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
	// Page d'accueil
    public function indexAction()
    {
        return $this->render('WebMainBundle:Default:index.html.twig');
    }

    // Page avec GMAP
    public function mapAction()
    {
    	return $this->render('WebMainBundle:Default:map.html.twig');
    }

    // Page avec favoris
    public function favorisAction()
    {
        // Current user
        $user = $this->container->get('security.context')->getToken()->getUser();

        $favoris = new Favoris();
        $favoris->setNomStation('jojo');
        $favoris->addUser($user);

        $repo = $this->getDoctrine()->getManager();
        $repo->persist($favoris);
        $repo->flush();
        return new Response('OK');
        // return $this->render('WebMainBundle:Default:favoris.html.twig', array(
        //     'favoris' => $favoris
        // ));
    }
}
